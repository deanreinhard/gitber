import { GitberAngularPage } from './app.po';

describe('gitber-angular App', () => {
  let page: GitberAngularPage;

  beforeEach(() => {
    page = new GitberAngularPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
