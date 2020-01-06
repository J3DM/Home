export class User {

  public email: string;
  public id: string;
  private _token: string;
  private _tokenExpirationDate: Date;

  constructor(email: string, id: string, token: string, expirationDate: number) {
    this.email = email;
    this.id = id;
    this._token = token;
    this._tokenExpirationDate = new Date(expirationDate);
  }

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    } else {
      return this._token;
    }
  }
}
