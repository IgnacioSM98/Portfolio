const axios = require("axios");
const { Recipe, Diet } = require("../db");

const getAllRecipes = async () => {
  try {
    let recipes = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY}&addRecipeInformation=true&number=100`
    );

    recipes = recipes.data.results.map((res) => ({
      id: res.id,
      name: res.title,
      img: res.image,
      score: res.spoonacularScore,
      diets: res.diets,
    }));

    let recipesDB = await Recipe.findAll();

    recipesDB = recipesDB.map((recipe) => ({
      id: recipe.dataValues.id,
      name: recipe.dataValues.name,
      score: recipe.dataValues.score,
      img: recipe.dataValues.image,
      diets: recipe.dataValues.types.split(","),
    }));

    recipes = recipes.concat(recipesDB);

    return recipes;
  } catch (error) {
    console.log(error);
  }
};

const getRecipesDetails = async (id) => {
  try {
    const { data } = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${process.env.API_KEY}`
    );

    return {
      id: data.id,
      name: data.title,
      image: data.image,
      resumen: data.summary,
      score: data.spoonacularScore,
      healthyLvl: data.healthScore,
      instructions: data.instructions,
      diets: data.diets,
    };
  } catch {
    let recipesDB = await Recipe.findByPk(id);

    return recipesDB;
  }
};

const getTypes = async (types) => {
  const dietsAux = types.split(",");

  const TypesOfDiets = dietsAux.map((diet) => ({
    name: diet,
  }));

  try {
    if (TypesOfDiets) {
      const listaDietas = await Diet.bulkCreate(TypesOfDiets, {
        returning: true,
      });
      return listaDietas;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllRecipes,
  getRecipesDetails,
  getTypes,
};
