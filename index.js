const mongoose = require('mongoose');

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model');
// Import of the data from './data.json'
const data = require('./data');

const MONGODB_URI = 'mongodb://localhost/recipe-app';

const data1 = {
  "title": "Fried egg",
  "level": "UltraPro Chef",
  "ingredients": ["1 egg"],
  "cuisine": "Lazy",
  "dishType": "main_course",
  "image": "https://www.greekboston.com/wp-content/uploads/2015/10/fried-egg-250x204.jpg",
  "duration": 3,
  "creator": "Chef Homo Erectus"
};

async function myRecipeApp () {
  try {
    await mongoose.connect(MONGODB_URI);
    await console.log(`Connected to the database`);
    await Recipe.deleteMany();
  
    const recipe = await Recipe.create(data1);
    await console.log(`Iteration 2: ${recipe.title}`);
  
    const recipes = await Recipe.insertMany(data);
    await recipes.forEach(recipe => console.log(`Iteration 3: ${recipe.title}`));
          
    const updatedRecipe = await Recipe.findOneAndUpdate({title : "Rigatoni alla Genovese" }, { duration : 100 }, { new : true });
    await console.log(`Iteration 4: ${updatedRecipe.title} cooking time has been updated to ${updatedRecipe.duration} minutes`);
            
    await Recipe.deleteOne({ title : "Carrot Cake" });
    await console.log(`Iteration 5: I am sorry but Carrot Cake is no longer available.`);
          
    await mongoose.connection.close();
    await console.log('Iteration 6: Mongoose default connection disconnected through app termination');
    await process.exit(0);

  } catch (error) {
    console.error('This error has happened:', error);
  }
}

myRecipeApp ();

/*

Fully working - Callback Hell

mongoose.connect(MONGODB_URI)
  .then(x => {
    console.log(`Connected to the database: "${x.connection.name}"`);
    // Before adding any recipes to the database, let's remove all existing ones
    return Recipe.deleteMany();
  })
  .then(() => {
    Recipe.create(data1)
      .then(recipe => {
        console.log(`Iteration 2: ${recipe.title}`);
        Recipe.insertMany(data)
        .then( recipes => {
          recipes.forEach(recipe => console.log(`Iteration 3: ${recipe.title}`));
          Recipe.findOneAndUpdate({title : "Rigatoni alla Genovese" }, { duration : 100 }, { new : true })
          .then (updatedRecipe => {
            console.log(`Iteration 4: ${updatedRecipe.title} cooking time has been updated to ${updatedRecipe.duration} minutes`);
            Recipe.deleteOne({ title : "Carrot Cake" })
            .then(finish => {
              console.log(`Iteration 5: I am sorry but Carrot Cake is no longer available.`);
              mongoose.connection.close(() => {
                console.log('Iteration 6: Mongoose default connection disconnected through app termination');
                process.exit(0);
              });
            });
          });
        });
      });
    })
  .catch(error => {
    console.error('This error has happened:', error);
  });

_________________________________________________________________________________________________________________________

Fully working - Chaining 

mongoose.connect(MONGODB_URI)
  .then(x => {
    console.log(`Connected to the database: "${x.connection.name}"`);
    // Before adding any recipes to the database, let's remove all existing ones
    return Recipe.deleteMany();
  })
  .then(() => {
    return Recipe.create(data1);
  })
  .then(recipe => {
    console.log(`Iteration 2: ${recipe.title}`);
    return Recipe.insertMany(data);
  })
  .then( recipes => {
    recipes.forEach(recipe => console.log(`Iteration 3: ${recipe.title}`));
    return Recipe.findOneAndUpdate({title : "Rigatoni alla Genovese" }, { duration : 100 }, { new : true })
  })        
  .then (updatedRecipe => {
    console.log(`Iteration 4: ${updatedRecipe.title} cooking time has been updated to ${updatedRecipe.duration} minutes`);
    return Recipe.deleteOne({ title : "Carrot Cake" });
  })         
  .then(finish => {
    console.log(`Iteration 5: I am sorry but Carrot Cake is no longer available.`);
    return mongoose.connection.close();
  })
  .then (() => {   
      console.log('Iteration 6: Mongoose default connection disconnected through app termination');
      return process.exit(0);
  }))
  .catch(error => {
    console.error('This error has happened:', error);
  });

  */