const {
  getAllRecipes,
  getRecipesDetails,
  getTypes,
} = require("../components/functions");
const { Router } = require("express");
const { Recipe, Diet } = require("../db");
const { v4: uuidv4 } = require("uuid");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.get("/recipes", async (req, res) => {
  let todasRecetas = [];
  const name = req.query.name;

  try {
    const todasRecetasAux = await getAllRecipes();

    if (name) {
      todasRecetas = todasRecetasAux.filter((receta) => {
        if (receta.name.toLowerCase().includes(name.toLowerCase())) {
          return receta;
        }
      });
    } else {
      todasRecetas = todasRecetasAux;
    }

    res.status(200).json(todasRecetas);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

router.get("/recipes/:id", async (req, res) => {
  try {
    const recipesDetails = await getRecipesDetails(req.params.id);
    res.json(recipesDetails);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

router.get("/types", async (req, res) => {
  const types = req.query.types;
  try {
    let dietasList = await Diet.findAll();

    if (dietasList.length === 0) {
      dietasList = await getTypes(types);
    }
    res.send(dietasList);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

router.post("/createFood", async (req, res) => {
  const {
    body: { name, resumen, score, healthyLvl, instructions, image, diets },
  } = req;

  const recipeCreated = await Recipe.create({
    id: uuidv4(),
    name,
    resumen,
    score,
    healthyLvl,
    instructions,
    image,
    types: diets.map((e) => e.name.toLowerCase()).join(","),
  });

  res.send({
    id: recipeCreated.id,
    name: recipeCreated.name,
    img: recipeCreated.image,
    score: recipeCreated.score,
    diets: recipeCreated.types.split(","),
  });
});

module.exports = router;
