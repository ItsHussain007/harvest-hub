"use client";

import React, { useEffect, useState } from "react";
import ProfileCard from "./ProfileCard";

type Farm = {
    id: number;
    name: string;
    contact: string;
    address: string;
    postcode: string;
    email: string;
    phone: string;
    description: string;
};

export default function Profile() {
    const [farms, setFarms] = useState<Farm[]>([]);
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        fetch("/api/profiles")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Fetched farms:", data);
                setFarms(data);
            })
            .catch((error) => {
                console.error("Error fetching farms:", error);
                alert("Failed to fetch farm data. Please try again later.");
            });
    }, []);

    const filteredFarms = farms.filter(
        (farm) =>
            farm.name.toLowerCase().includes(search.toLowerCase()) ||
            farm.contact.toLowerCase().includes(search.toLowerCase()) ||
            farm.address.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold mb-10 text-[#013A40]">Farm Profiles</h1>
                <input
                    type="text"
                    placeholder="Search farms..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm mb-8"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredFarms.map((farm) => (
                        <ProfileCard key={farm.id} farm={farm} />
                    ))}
                </div>
            </div>
        </div>
    );
}
