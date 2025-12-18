import { database, auth } from '../firebase';
import { ref, set, push, get, child, update } from "firebase/database";
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

// Helpers for reading/writing
const dbRead = async (path) => {
  try {
    const snapshot = await get(child(ref(database), path));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Firebase Read Error:", error);
    return null;
  }
};

const dbWrite = async (path, data) => {
  try {
    await set(ref(database, path), data);
    return true;
  } catch (error) {
    console.error("Firebase Write Error:", error);
    return false;
  }
};

const dbPush = async (path, data) => {
  try {
    const newRef = push(ref(database, path));
    await set(newRef, { ...data, id: newRef.key });
    return { ...data, id: newRef.key };
  } catch (error) {
    console.error("Firebase Push Error:", error);
    return null;
  }
};

// Current User State (Simple Cache)
let currentUser = null;
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = {
      id: user.uid,
      full_name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      user_role: localStorage.getItem('user_role') || 'worker' // Defaulting to worker if not set
    };
  } else {
    currentUser = null;
  }
});

export const base44 = {
  auth: {
    isAuthenticated: async () => {
      return new Promise((resolve) => {
        let unsubscribe;
        const timeoutId = setTimeout(() => {
          console.warn("Auth check timed out");
          if (unsubscribe) unsubscribe();
          resolve(false);
        }, 5000);

        unsubscribe = onAuthStateChanged(auth, (user) => {
          clearTimeout(timeoutId);
          if (unsubscribe) unsubscribe();
          resolve(!!user);
        });
      });
    },
    me: async () => {
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          if (user) {
            resolve({
              id: user.uid,
              full_name: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              user_role: localStorage.getItem('user_role') // Return stored role
            });
          } else {
            resolve(null);
          }
        });
      });
    },
    updateMe: async (data) => {
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in");

      if (data.user_role) {
        localStorage.setItem('user_role', data.user_role);

        // Create profile if not exists
        const profilePath = data.user_role === 'employer' ? `employers/${user.uid}` : `workers/${user.uid}`;
        const existingProfile = await dbRead(profilePath);

        if (!existingProfile) {
          await dbWrite(profilePath, {
            id: user.uid,
            full_name: user.displayName,
            email: user.email,
            created_at: new Date().toISOString()
          });
        }
      }
      return true;
    },
    loginWithGoogle: async (role = null) => {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // If role is explicitly provided (e.g. from RoleSelection flow if we allow login there)
        if (role) {
          localStorage.setItem('user_role', role);
          const profilePath = role === 'employer' ? `employers/${user.uid}` : `workers/${user.uid}`;
          const existingProfile = await dbRead(profilePath);
          if (!existingProfile) {
            await dbWrite(profilePath, {
              id: user.uid,
              full_name: user.displayName,
              email: user.email,
              created_at: new Date().toISOString()
            });
          }
        } else {
          // Generic Login - Try to detect role
          // Check Worker Profile
          const workerProfile = await dbRead(`workers/${user.uid}`);
          if (workerProfile) {
            localStorage.setItem('user_role', 'worker');
          } else {
            // Check Employer Profile
            const employerProfile = await dbRead(`employers/${user.uid}`);
            if (employerProfile) {
              localStorage.setItem('user_role', 'employer');
            } else {
              // No role found - New User? Or just hasn't selected yet.
              // Clear any stale role
              localStorage.removeItem('user_role');
            }
          }
        }
        return user;
      } catch (error) {
        console.error("Login Failed", error);
        throw error;
      }
    },
    redirectToLogin: (url) => {
      // Ideally should trigger the login popup here or navigate to a dedicated login route
      // For now, we rely on the component to call loginWithGoogle
      console.log("Redirect needed to:", url);
    },
    logout: async (url) => {
      await signOut(auth);
      localStorage.removeItem('user_role');
      if (url) window.location.href = url;
    },
    isAdmin: async () => {
      const user = auth.currentUser;
      if (!user) return false;
      const allowedEmails = ['tavqeerhussain6@gmail.com', 'flowrk66@gmail.com'];
      return allowedEmails.includes(user.email);
    },
  },
  dbRead,
  dbWrite,
  dbPush,
  entities: {
    Job: {
      filter: async (filters) => {
        // Warning: Realtime DB filtering is limited. Fetching all for now (small scale)
        const allJobs = await dbRead('jobs');
        if (!allJobs) return [];
        const jobsArray = Object.values(allJobs);

        // Client-side filtering
        return jobsArray.filter(job => {
          if (filters?.status && job.status !== filters.status) return false;
          if (filters?.employer_id && job.employer_id !== filters.employer_id) return false;
          return true;
        });
      },
      get: async (id) => {
        return await dbRead(`jobs/${id}`);
      },
      create: async (data) => {
        return await dbPush('jobs', { ...data, created_at: new Date().toISOString() });
      },
      update: async (id, data) => {
        return await update(ref(database, `jobs/${id}`), data);
      },
      delete: async (id) => {
        return await set(ref(database, `jobs/${id}`), null);
      }
    },
    EmployerProfile: {
      filter: async (filters) => {
        const allProfiles = await dbRead('employers');
        if (!allProfiles) return [];
        const profilesArray = Object.values(allProfiles);

        return profilesArray.filter(profile => {
          if (filters?.user_id && profile.id !== filters.user_id) return false;
          return true;
        });
      },
      get: async (id) => dbRead(`employers/${id}`),
      update: async (id, data) => {
        return await update(ref(database, `employers/${id}`), data);
      },
      create: async (data) => {
        return await dbWrite(`employers/${data.id}`, data);
      },
    },
    WorkerProfile: {
      filter: async (filters) => {
        const allProfiles = await dbRead('workers');
        if (!allProfiles) return [];
        const profilesArray = Object.values(allProfiles);

        return profilesArray.filter(profile => {
          if (filters?.user_id && profile.id !== filters.user_id) return false;
          return true;
        });
      },
      get: async (id) => dbRead(`workers/${id}`),
      update: async (id, data) => {
        return await update(ref(database, `workers/${id}`), data);
      },
      create: async (data) => {
        return await dbWrite(`workers/${data.id}`, data);
      },
    }
  }
};
