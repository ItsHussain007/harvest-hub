import React from "react";
import Link from "next/link";

type FarmProps = {
    farm: {
        id: number;
        name: string;
        contact: string;
        address: string;
        postcode: string;
        email: string;
        phone: string;
        description: string;
    };
};

export default function ProfileCard({ farm }: FarmProps) {
    return (
        <Link href={`/profile/${farm.id}`} className="block">
            <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition">
                <h2 className="text-xl font-semibold mb-2">{farm.name}</h2>
                <p className="text-gray-700 mb-1">
                    <strong>Contact:</strong> {farm.contact}
                </p>
                <p className="text-gray-700 mb-1">
                    <strong>Address:</strong> {farm.address}, {farm.postcode}
                </p>
                <p className="text-gray-700 mb-1">
                    <strong>Email:</strong> {farm.email}
                </p>
                <p className="text-gray-700 mb-1">
                    <strong>Phone:</strong> {farm.phone}
                </p>
                <p className="text-gray-700">
                    <strong>Description:</strong> {farm.description}
                </p>
            </div>
        </Link>
    );
}
