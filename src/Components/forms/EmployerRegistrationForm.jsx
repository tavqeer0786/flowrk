import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, MapPin, Phone, Loader2 } from 'lucide-react';

const employerTypes = [
  { value: 'shop_owner', label: 'Shop Owner (Dukaan Maalik)' },
  { value: 'home_owner', label: 'Home Owner (Ghar Maalik)' },
  { value: 'contractor', label: 'Contractor (Thekedaar)' },
  { value: 'event_organizer', label: 'Event Organizer' }
];

export default function EmployerRegistrationForm({ onSubmit, isLoading, initialData = {} }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    city: initialData.city || '',
    area: initialData.area || '',
    employer_type: initialData.employer_type || '',
    whatsapp: initialData.whatsapp || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2">
          <Building className="w-4 h-4 text-teal-600" />
          Naam / Shop Name *
        </Label>
        <Input
          id="name"
          placeholder="Aapka naam ya dukaan ka naam"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="h-12 rounded-xl"
        />
      </div>

      {/* City & Area */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-600" />
            City *
          </Label>
          <Input
            id="city"
            placeholder="e.g., Delhi"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
            className="h-12 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="area">Area / Locality *</Label>
          <Input
            id="area"
            placeholder="e.g., Lajpat Nagar"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            required
            className="h-12 rounded-xl"
          />
        </div>
      </div>

      {/* Employer Type */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Building className="w-4 h-4 text-teal-600" />
          Aap Kaun Hain? *
        </Label>
        <Select
          value={formData.employer_type}
          onValueChange={(value) => setFormData({ ...formData, employer_type: value })}
        >
          <SelectTrigger className="h-12 rounded-xl">
            <SelectValue placeholder="Type choose karo" />
          </SelectTrigger>
          <SelectContent>
            {employerTypes.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* WhatsApp */}
      <div className="space-y-2">
        <Label htmlFor="whatsapp" className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-teal-600" />
          WhatsApp Number *
        </Label>
        <Input
          id="whatsapp"
          type="tel"
          placeholder="10 digit number"
          value={formData.whatsapp}
          onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
          required
          className="h-12 rounded-xl"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading || !formData.name || !formData.city || !formData.area || !formData.employer_type || !formData.whatsapp}
        className="w-full h-12 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold rounded-xl shadow-lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          'Profile Save Karo'
        )}
      </Button>
    </form>
  );
}