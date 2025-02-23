"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Farmer = {
  id: number;
  name: string;
  contact: string;
  address: string;
  postcode: string;
  email: string;
  phone: string;
  description: string;
};

export default function FarmDetails() {
  const params = useParams();
  const [farmer, setFarmer] = useState<Farmer | null>(null);

  useEffect(() => {
    fetch(`/api/profiles/${params.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setFarmer(data))
      .catch((error) => {
        console.error("Error fetching farm details:", error);
        alert("Failed to fetch farm details.");
      });
  }, [params.id]);

  if (!farmer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6 text-[#013A40]">{farmer.name}</h1>
      <p className="text-lg mb-4">
        <strong>Contact Name:</strong> {farmer.contact}
      </p>
      <p className="text-lg mb-4">
        <strong>Address:</strong> {farmer.address}, {farmer.postcode}
      </p>
      <p className="text-lg mb-4">
        <strong>Email:</strong> {farmer.email}
      </p>
      <p className="text-lg mb-4">
        <strong>Phone:</strong> {farmer.phone}
      </p>
      <p className="text-lg">
        <strong>Description:</strong> {farmer.description}
      </p>
    </div>
  );
}
