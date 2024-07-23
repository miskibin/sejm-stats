// components/EnvoyFilter.tsx
"use client";

import { useState } from "react";

interface Club {
  id: string;
  membersCount: number;
}

interface District {
  districtName: string;
}

interface EnvoyFilterProps {
  clubs: Club[];
  districts: District[];
  onFilter: (filters: any) => void;
}

export const EnvoyFilter: React.FC<EnvoyFilterProps> = ({
  clubs,
  districts,
  onFilter,
}) => {
  const [filters, setFilters] = useState({
    searchEnvoys: "",
    club: [] as string[],
    district: "all",
    mostActive: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFilters((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "club") {
      const clubFilters = filters.club.includes(value)
        ? filters.club.filter((club) => club !== value)
        : [...filters.club, value];
      setFilters((prev) => ({ ...prev, club: clubFilters }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      <h5 className="text-xl font-bold mb-4">Filtruj</h5>
      <input
        type="text"
        name="searchEnvoys"
        placeholder="wyszukaj posła..."
        value={filters.searchEnvoys}
        onChange={handleChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
      />
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Klub
        </label>
        {clubs.map((club) => (
          <div key={club.id} className="mb-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="club"
                value={club.id}
                checked={filters.club.includes(club.id)}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700">
                {club.id} ({club.membersCount})
              </span>
            </label>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Okręg wyborczy
        </label>
        <select
          name="district"
          value={filters.district}
          onChange={handleChange}
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="all">Wszystkie</option>
          {districts.map((district) => (
            <option key={district.districtName} value={district.districtName}>
              {district.districtName}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            name="mostActive"
            checked={filters.mostActive}
            onChange={handleChange}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="ml-2 text-gray-700">Najbardziej aktywni</span>
        </label>
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Filtruj
        </button>
        <button
          type="reset"
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Resetuj
        </button>
      </div>
    </form>
  );
};
