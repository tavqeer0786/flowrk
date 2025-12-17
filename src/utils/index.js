// Utility functions
export const cn = (...classes) => classes.filter(Boolean).join(' ');

export const createPageUrl = (pageName) => {
    if (pageName === 'Home') return '/';
    // Handle converting PascalCase to kebab-case or just return the name for now if routing matches
    // The layout uses strings like 'RoleSelection' which map to paths.
    // Let's assume paths are /RoleSelection for now, or match the user's implicit routing.
    return `/${pageName}`;
};

