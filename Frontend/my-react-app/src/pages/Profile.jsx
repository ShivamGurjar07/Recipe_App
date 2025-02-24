import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getSavedRecipes, reorderSavedRecipes } from "../api/api";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.token) {
      getSavedRecipes(user.token)
        .then((recipes) => {
          if (Array.isArray(recipes)) {
            setSavedRecipes(recipes);
          } else {
            setError("Failed to load saved recipes.");
          }
        })
        .catch(() => setError("Error fetching saved recipes."));
    } else {
      setError("You must be logged in to view saved recipes.");
    }
  }, [user]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const reorderedRecipes = [...savedRecipes];
    const [movedRecipe] = reorderedRecipes.splice(result.source.index, 1);
    reorderedRecipes.splice(result.destination.index, 0, movedRecipe);

    setSavedRecipes(reorderedRecipes);

    try {
      const newOrder = reorderedRecipes.map((recipe) => recipe._id);
      await reorderSavedRecipes(newOrder, user.token);
    } catch (error) {
      console.error("Error reordering recipes:", error);
      setError("Failed to save new order.");
    }
  };

  return (
    <div className="saved-recipe">
      <h1>My Saved Recipes</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="savedRecipes">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="saved-recipe-list"
            >
              {savedRecipes.length > 0
                ? savedRecipes.map((recipe, index) => (
                    <Draggable
                      key={recipe._id}
                      draggableId={recipe._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="saved-item"
                        >
                          <h3>{recipe.title}</h3>
                          <img src={recipe.image} alt={recipe.title} />
                        </div>
                      )}
                    </Draggable>
                  ))
                : !error && <p>No saved recipes yet.</p>}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Profile;
