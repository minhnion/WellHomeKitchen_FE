"use client";
import React, { useState } from "react";

export default function ShowroomsClient({ locations }) {
  const [selected, setSelected] = useState(locations[0]);

  return (
    <div className="flex flex-col md:flex-row bg-white shadow rounded-b-lg overflow-hidden">
      <div
        className="md:w-1/3 p-4 overflow-y-auto"
        style={{ maxHeight: "600px" }}
      >
        {locations.map((loc) => (
          <div
            key={loc._id}
            onClick={() => setSelected(loc)}
            className={`p-4 mb-4 border rounded cursor-pointer ${
              selected._id === loc._id ? "bg-gray-200 border-blue-500" : ""
            }`}
          >
            <h3 className="font-semibold text-lg">{loc.address}</h3>
            <p className="text-sm mt-1">Giờ mở cửa: {loc.openingHours}</p>
            <p className="text-sm mt-1">SĐT: {loc.phone}</p>
          </div>
        ))}
      </div>

      <div className="md:w-2/3 h-[600px]">
        {selected && (
          <iframe
            src={selected.iframeUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        )}
      </div>
    </div>
  );
}