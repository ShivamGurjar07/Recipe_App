import RecipeCard from "./RecipeCard";

const RecipeList = ({ recipes = [] }) => {
  return (
    <div className="recipe-list">
      {recipes.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
        recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
      )}
    </div>
  );
};

export default RecipeList;
