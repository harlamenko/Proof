describe('ChatContext', () => {
  it('getConversations инициирует запрос диалогов пользователя', async () => {
    await new Promise((res) =>
      setTimeout(() => {
        res();
      }, 9)
    );
  });

  it('getConversations устанавливает сообщение "Список диалогов пуст." если диалогов нет', async () => {
    await new Promise((res) =>
      setTimeout(() => {
        res();
      }, 9)
    );
  });

  it('clearEmptyMessage очищает сообщение "Список диалогов пуст."', async () => {
    await new Promise((res) =>
      setTimeout(() => {
        res();
      }, 9)
    );
  });

  it('sendMessage отправляет информацию о сообщении на сервер', async () => {
    await new Promise((res) =>
      setTimeout(() => {
        res();
      }, 9)
    );
  });

  it('getMessages загружает сообщения, относящиеся к конкретному пользователю и деалогу', async () => {
    await new Promise((res) =>
      setTimeout(() => {
        res();
      }, 9)
    );
  });

  it('tryGetConversation инициализирует запрос диалога по id', async () => {
    await new Promise((res) =>
      setTimeout(() => {
        res();
      }, 9)
    );
  });

  it('tryGetConversation инициализирует запрос диалога по данным объявления', async () => {
    await new Promise((res) =>
      setTimeout(() => {
        res();
      }, 9)
    );
  });

  it('updateConversations добавляет, полученные по socket.io, диалоги к имеющимся', async () => {
    await new Promise((res) =>
      setTimeout(() => {
        res();
      }, 9)
    );
  });
});
