export class Message {
  constructor(msg) {
    Object.entries(msg).forEach(([k, v]) => {
      if (k === 'user' && v.hasOwnProperty('_id')) {
        this[k] = v._id;
        return;
      }

      this[k] = v;
    });
  }
}
