import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HomeController {
  public async index({ view, auth, session, request }: HttpContextContract) {
    const { search } = request.get()
    const user = auth.user

    if (user) {
      await user.load('documents', (builder) => {
        builder.where('tags', 'ilike', `%${search || ''}%`)
        builder.preload('file')
      })
      session.put('documents', user.documents)
    }

    return view.render('home/index')
  }
}
