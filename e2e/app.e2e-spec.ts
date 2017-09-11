import { Ng2AppCrudPage } from './app.po';

describe('ng2-app-crud App', () => {
  let page: Ng2AppCrudPage;

  beforeEach(() => {
    page = new Ng2AppCrudPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
