import Shimmer from "./Shimmer";
import { useParams } from "react-router-dom";
import useRestaurantMenu from "../utils/useRestrauntMenu";
import RestaurantCategory from "./RestaurantCategory";
import { useState } from "react";

const RestaurantMenu = () => {
  const { resId } = useParams();
  const dummy = "Dummy Data";
  const resInfo = useRestaurantMenu(resId);
  const [showIndex, setShowIndex] = useState(null);

  if (resInfo === null) return <Shimmer />;

  // Extract restaurant info safely
  const restaurantInfoCard = resInfo?.cards.find(
    (c) =>
      c.card?.card?.["@type"] ===
      "type.googleapis.com/swiggy.presentation.food.v2.Restaurant"
  );
  const { name, cuisines, costForTwoMessage } =
    restaurantInfoCard?.card?.card?.info || {};

  // Extract categories safely
  const regularCards =
    resInfo?.cards.find((c) => c.groupedCard)?.groupedCard?.cardGroupMap
      ?.REGULAR?.cards || [];

  const categories = regularCards.filter(
    (c) =>
      c.card?.card?.["@type"] ===
      "type.googleapis.com/swiggy.presentation.food.v2.ItemCategory"
  );

  return (
    <div className="text-center">
      <h1 className="font-bold my-6 text-2xl">{name}</h1>
      <p className="font-bold text-lg">
        {cuisines?.join(", ")} - {costForTwoMessage}
      </p>

      {/* Controlled accordion component for each category */}
      {categories.map((category, index) => (
        <RestaurantCategory
          key={category?.card?.card?.title}
          data={category?.card?.card}
          showItems={index === showIndex}
          setShowIndex={() => setShowIndex(index)}
          dummy={dummy}
        />
      ))}
    </div>
  );
};

export default RestaurantMenu;
