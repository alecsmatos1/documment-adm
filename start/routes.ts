/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

// public routes
Route.resource('sessions', 'SessionsController').only(['index', 'store'])

// authenticated routes
Route.group(() => {
  Route.get('/', 'HomeController.index').as('home.index')
  Route.delete('sessions', 'SessionsController.destroy').as('sessions.destroy')
  Route.resource('documents', 'DocumentsController').except(['index', 'show'])
  Route.get('/documents.download', 'DocumentsController.download').as('documents.download')
}).middleware('auth')
