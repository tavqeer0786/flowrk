import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { User, MapPin, Briefcase, Clock, Phone, Loader2 } from 'lucide-react';
import { categoryLabels } from '@/components/ui/CategoryCard';

const skills = Object.entries(categoryLabels);

const availabilityOptions = [
  { value: 'full_day', label: 'Full Day' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'flexible', label: 'Flexible' }
];

export default function WorkerRegistrationForm({ onSubmit, isLoading, initialData = {} }) {
  const [formData, setFormData] = useState({
    full_name: initialData.full_name || '',
    city: initialData.city || '',
    area: initialData.area || '',
    skills: initialData.skills || [],
    availability: initialData.availability || 'full_day',
    whatsapp: initialData.whatsapp || '',
    experience: initialData.experience || ''
  });

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="full_name" className="flex items-center gap-2">
          <User className="w-4 h-4 text-teal-600" />
          Aapka Naam *
        </Label>
        <Input
          id="full_name"
          placeholder="Full name likho"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
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
            placeholder="e.g., Mumbai"
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
            placeholder="e.g., Andheri West"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            required
            className="h-12 rounded-xl"
          />
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-teal-600" />
          Aapke Skills (ek ya zyada choose karo) *
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {skills.map(([value, label]) => (
            <div
              key={value}
              onClick={() => handleSkillToggle(value)}
              className={`
                flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all
                ${formData.skills.includes(value) 
                  ? 'border-teal-500 bg-teal-50' 
                  : 'border-gray-200 hover:border-teal-200'}
              `}
            >
              <div className={`
                w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                ${formData.skills.includes(value) 
                  ? 'bg-teal-600 border-teal-600' 
                  : 'border-gray-300'}
              `}>
                {formData.skills.includes(value) && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-600" />
          Availability *
        </Label>
        <Select
          value={formData.availability}
          onValueChange={(value) => setFormData({ ...formData, availability: value })}
        >
          <SelectTrigger className="h-12 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availabilityOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* WhatsApp */}
      <div className="space-y-2">
        <Label htmlFor="whatsapp" className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-teal-600" />
          WhatsApp Number
        </Label>
        <Input
          id="whatsapp"
          type="tel"
          placeholder="10 digit number"
          value={formData.whatsapp}
          onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
          className="h-12 rounded-xl"
        />
      </div>

      {/* Experience */}
      <div className="space-y-2">
        <Label htmlFor="experience">Experience (Optional)</Label>
        <Input
          id="experience"
          placeholder="e.g., 2 saal"
          value={formData.experience}
          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
          className="h-12 rounded-xl"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading || !formData.full_name || !formData.city || !formData.area || formData.skills.length === 0}
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