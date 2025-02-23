import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "./components/Footer";

const navlinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Locations", href: "/locations" },
  { name: "About us", href: "/about" },
  { name: "Contact us", href: "/contact" },
  { name: "Farmers Guide", href: "/farmers" },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="flex h-screen relative">
        <Image
          src="/home/home-image.jpg"
          alt="logo"
          width={10000}
          height={10000}
          style={{ objectFit: "contain" }}
          className="absolute -z-10"
        />
        <div className="flex-1 p-10 flex flex-col">
          <h1 className="text-4xl text-white font-semibold">Harvest Hub</h1>
          <div className="flex flex-row mt-8 items-center gap-4">
            {navlinks.map((link) => (
              <Link href={link.href} key={link.name}>
                <div className="flex flex-row items-center gap-2">
                  <p className="text-[#013A40]">{link.name}</p>
                  <ChevronDown className="w-4 h-4 text-[#013A40]" />
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-16 h-96 w-[30%] ml-16">
            <h1 className="text-white text-6xl font-bold">
              Connecting farmers and people
            </h1>
            <p className="text-white text-xl mt-4">
              support your local economy and starts a sustainable development
              project.
            </p>
            <button className="bg-[#00B207] text-white px-16 py-2 rounded-full mt-8 items-center justify-center flex">
              <p className="text-white font-semibold">start now</p>
            </button>
          </div>
        </div>
      </section>
      <section className="flex relative flex-row h-screen bg-white py-36 items-center justify-center">
        <div className="w-full bg-[#E6E8EC] h-full p-16">
          <div className="pr-[50rem]">
            <h1 className="text-4xl text-[#013A40] font-semibold">
              Explore over 20,000 farms across the U.K find your local farm now.
            </h1>
            <div className="mt-16">
              <p>Search by postcode</p>
              <div className="flex flex-row items-center gap-2 mt-4">
                <input
                  placeholder="Enter postcode"
                  type="text"
                  className="w-1/2 rounded-full px-4 py-2"
                />
                <button className="bg-[#00B207] text-white px-4 py-2 rounded-full">
                  <p className="text-white font-semibold">Search</p>
                </button>
              </div>
            </div>
          </div>
        </div>
        <Image
          src="/home/map.jpg"
          alt="map"
          width={600}
          height={600}
          style={{ objectFit: "contain" }}
          className="absolute right-20"
        />
      </section>
      <section className="flex py-20 px-10 bg-white  items-center justify-center">
        <div className="w-full bg-[#013A40] flex flex-col justify-between p-16 rounded-3xl px-48">
          <h1 className="text-white text-4xl font-semibold text-center">
            Start in 3 simple steps
          </h1>
          <div className="flex flex-row justify-between mt-16">
            <p className="text-white text-md">1. Find a farm</p>
            <p className="text-white text-md">2. Select items</p>
            <p className="text-white text-md">3. Purchase</p>
            <p className="text-white text-md">4. Collect</p>
          </div>
          <div className="flex justify-center">
            <button className="bg-[#00B207] text-white px-16 py-2 rounded-full mt-8 items-center justify-center flex">
              <p className="text-white font-semibold">start now</p>
            </button>
          </div>
        </div>
      </section>
      <section className="flex flex-row justify-between px-28 py-16 bg-[#F4F1F1]">
        <div className="flex flex-col max-w-[40%]">
          <h1 className="text-4xl mx-auto text-[#013A40] font-semibold">
            Are you a farmer?
          </h1>
          <p className="text-4xl text-center text-[#013A40] mt-4">
            You can sell your products through our website. Create a farmer
            account ,list your products and beging sellings.
          </p>
          <div className="mx-auto flex flex-row items-center gap-8 mt-8">
            <button className="bg-[#00B207] text-white px-16 py-2 rounded-full items-center justify-center flex">
              Start now
            </button>
            <p className="text-md text-[#013A40]">Learn more</p>
          </div>
        </div>
        <Image
          src="/home/farmer.jpg"
          alt="farmer"
          width={350}
          height={350}
          style={{ objectFit: "contain" }}
          className=""
        />
      </section>
      <section className="h-screen w-full bg-white py-16 px-28">
        <p className="text-4xl text-[#013A40] font-semibold">
          Fresh from the farm to your door – subscribe for regular,
          locally-sourced food deliveries.
        </p>
        <div className="h-96 flex flex-row items-center justify-between mt-16 px-16">
          <div className="relative">
            <Image
              src="/home/potatoes.jpg"
              alt="potatoes"
              width={450}
              height={450}
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="relative">
            <Image
              src="/home/packaging.jpg"
              alt="packaging"
              width={450}
              height={450}
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
