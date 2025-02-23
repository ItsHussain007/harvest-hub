export default function PromotionSection() {
  const promotions = [
    { id: 1, title: "Organic Apples", discount: "15% off", description: "Fresh and crisp organic apples.", image: "/images/apples.jpg" },
    { id: 2, title: "Organic Carrots", discount: "10% off", description: "Naturally grown organic carrots.", image: "/images/carrots.jpg" },
    { id: 3, title: "Whole Milk", discount: "5% off", description: "Creamy and fresh whole milk.", image: "/images/milk.jpg" },
    { id: 4, title: "Cheddar Cheese", discount: "20% off", description: "Aged cheddar cheese, full of flavour.", image: "/images/cheese.jpg" },
  ];

  return (
    <section className="bg-gray-100 py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Current Promotions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promotions.map((promo) => (
            <div key={promo.id} className="bg-white p-6 shadow-lg rounded-lg flex flex-col items-center">
              <img 
                src={promo.image} 
                alt={promo.title} 
                className="w-32 h-32 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-2">{promo.title}</h3>
              <p className="text-green-700 font-bold mb-2">{promo.discount}</p>
              <p className="text-gray-700 text-center">{promo.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

  