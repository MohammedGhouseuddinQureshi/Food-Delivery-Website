import RestaurantCard, { withPromtedLabel } from "./RestaurantCard";
import { useState, useEffect, useContext } from "react";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import useOnlineStatus from "../utils/useOnlineStatus";
import UserContext from "../utils/UserContext";

const Body = () => {
  const [listOfRestaurants, setListOfRestaurants] = useState([]);
  const [filteredRestaurant, setFilteredRestaurant] = useState([]);
  const [searchText, setSearchText] = useState("");

  const RestaurantCardPromoted = withPromtedLabel(RestaurantCard);
  const { loggedInUser, setUserName } = useContext(UserContext);
  const onlineStatus = useOnlineStatus();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await fetch(
        "https://www.swiggy.com/dapi/restaurants/list/v5?lat=12.9352403&lng=77.624532&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING"
      );

      const json = await data.json();

      const restaurants =
        json?.data?.cards?.find(
          (card) =>
            card?.card?.card?.gridElements?.infoWithStyle?.restaurants
        )?.card?.card?.gridElements?.infoWithStyle?.restaurants || [];

      setListOfRestaurants(restaurants);
      setFilteredRestaurant(restaurants);

      // ✅ Debug: Log full restaurant entries
      console.log("Fetched restaurant list:");
      restaurants.forEach((res, i) => {
        console.log(
          `#${i + 1}`,
          "Name:", res?.info?.name,
          "| Image ID:", res?.info?.cloudinaryImageId,
          "| Cost:", res?.info?.costForTwo,
          "| Rating:", res?.info?.avgRating
        );
      });
    } catch (err) {
      console.error("Failed to fetch restaurant data:", err);
    }
  };

  if (!onlineStatus) {
    return (
      <h1>
        Looks like you're offline!! Please check your internet connection.
      </h1>
    );
  }

  if (listOfRestaurants.length === 0) return <Shimmer />;

  return (
    <div className="body">
      <div className="filter flex">
        <div className="search m-4 p-4">
          <input
            type="text"
            data-testid="searchInput"
            className="border border-solid border-black"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-green-100 m-4 rounded-lg"
            onClick={() => {
              const filtered = listOfRestaurants.filter((res) =>
                res.info?.name
                  ?.toLowerCase()
                  .includes(searchText.toLowerCase())
              );
              setFilteredRestaurant(filtered);
            }}
          >
            Search
          </button>
        </div>

        <div className="search m-4 p-4 flex items-center">
          <button
            className="px-4 py-2 bg-gray-100 rounded-lg"
            onClick={() => {
              const topRated = listOfRestaurants.filter(
                (res) => res.info?.avgRating > 4.3
              );
              setFilteredRestaurant(topRated);
            }}
          >
            Top Rated Restaurants
          </button>
        </div>

        <div className="search m-4 p-4 flex items-center">
          <label>UserName : </label>
          <input
            className="border border-black p-2"
            value={loggedInUser}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap">
        {filteredRestaurant
          .filter(
            (restaurant) =>
              restaurant?.info?.name &&
              restaurant?.info?.cloudinaryImageId &&
              restaurant?.info?.costForTwo &&
              restaurant?.info?.avgRating
          )
          .map((restaurant) => {
            const isPromoted = restaurant?.info?.promoted;
            return (
              <Link
                key={restaurant?.info?.id}
                to={`/restaurants/${restaurant?.info?.id}`}
              >
                {isPromoted ? (
                  <RestaurantCardPromoted resData={restaurant} />
                ) : (
                  <RestaurantCard resData={restaurant} />
                )}
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default Body;
