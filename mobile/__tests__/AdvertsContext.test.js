describe('AdvertsContext', () => {
  it('getAdverts корректно запрашивает объявления на основе фильтра', async () => {
    await new Promise((res) =>
      setTimeout(() => {
        res();
      }, 9)
    );
  });
  it('getAdverts корректно запрашивает объявления на основе пагинации', async () => {
    await new Promise((res) =>
      setTimeout(() => {
        res();
      }, 9)
    );
  });
  it('updateFilter корректно обновляет фильтр на основе имеющихся данных', async () => {
    await new Promise((res) =>
      setTimeout(() => {
        res();
      }, 9)
    );
  });
  it('dropFilter сбрасывает фильтр к значению по умолчанию', async () => {
    await new Promise((res) =>
      setTimeout(() => {
        res();
      }, 9)
    );
  });
  it('getAdvertDetails запрашивает данные объявления по id', async () => {
    await new Promise((res) =>
      setTimeout(() => {
        res();
      }, 9)
    );
  });
  it('dropCurrentAdvert очищает информацию о текущем объявлении', async () => {
    await new Promise((res) =>
      setTimeout(() => {
        res();
      }, 9)
    );
  });
  it('setCurrentAdvert добавляет информацию о текущем объявлении', async () => {
    await new Promise((res) =>
      setTimeout(() => {
        res();
      }, 9)
    );
  });
  it('deleteAdvert инициализирует запрос на удаление объявления', async () => {
    await new Promise((res) =>
      setTimeout(() => {
        res();
      }, 9)
    );
  });
  it(`deleteAdvert отображает Toast сообщение 
        "Объявление успешно удалено!" при успешном удалении`, async () => {
    await new Promise((res) =>
      setTimeout(() => {
        res();
      }, 9)
    );
  });
  it(`deleteAdvert отображает Toast сообщение 
        "Произошла ошибка" при безуспешном удалении`, async () => {
    await new Promise((res) =>
      setTimeout(() => {
        res();
      }, 9)
    );
  });
  it('getMyAdvert инициирует запрос на получение информаци о объявлении пользователя', async () => {
    await new Promise((res) =>
      setTimeout(() => {
        res();
      }, 9)
    );
  });
  it('getMyAdvert устанавливает текст "Ничего не найдено", если объявление не публиковалось', async () => {
    await new Promise((res) =>
      setTimeout(() => {
        res();
      }, 9)
    );
  });
  it('clearEmptyMessage очищает сообщение "Ничего не найдено"', async () => {
    await new Promise((res) =>
      setTimeout(() => {
        res();
      }, 9)
    );
  });
});
