module.exports = function() {
  app.set('view engine', 'pug');
  app.set('views', '.');
  
  app.get('/', (req, res) => {
    res.render('debug');
  })
}
