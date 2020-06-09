require("dotenv").config({ path: "test.env" });
const mongoose = require("mongoose");
const mongoUri = process.env.DB_URI;
const userSchema = require("../src/models/User");
const UserModel = new mongoose.model("User", userSchema);

const userData = {
  name: "Name",
  email: "qwerty@qwerty.com",
  password: "qwerty",
};

describe("User модель", () => {
  beforeAll(async () => {
    await mongoose.connect(
      mongoUri,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
      (err) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      }
    );
  });

  beforeEach(async () => {
    await UserModel.deleteOne({ email: userData.email });
  });

  it("Успешное создание и сохранение пользователя", async () => {
    const validUser = new UserModel(userData);
    const savedUser = await validUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.password).not.toBe(userData.password);
  });

  it("Пользователь успешно сохраняется, неуказанные данные имеют значение undefined", async () => {
    const userWithInvalidField = new UserModel(userData);
    const savedUserWithInvalidField = await userWithInvalidField.save();

    expect(savedUserWithInvalidField._id).toBeDefined();
    expect(savedUserWithInvalidField.image).not.toBeDefined();
  });

  it("Создание пользователя с mail'ом который уже был использован должен завершаться ошибкой", async () => {
    await UserModel.create(userData);
    const userWithoutRequiredField = new UserModel(userData);
    let error;

    try {
      const savedUserWithoutRequiredField = await userWithoutRequiredField.save();
      error = savedUserWithoutRequiredField;
    } catch (err) {
      error = err;
    }

    expect(error.name).toMatch("MongoError");
  });

  it("Создание пользователя без обязательных полей должен завершаться ошибкой", async () => {
    const userWithoutRequiredField = new UserModel({ name: "Name" });
    let err;

    try {
      const savedUserWithoutRequiredField = await userWithoutRequiredField.save();
      error = savedUserWithoutRequiredField;
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.password).toBeDefined();
  });
});
