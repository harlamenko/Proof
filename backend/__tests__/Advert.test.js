require("dotenv").config({ path: "test.env" });
const mongoose = require("mongoose");
const mongoUri = process.env.DB_URI;
const advertSchema = require("../src/models/Advert");
const AdvertModel = new mongoose.model("Advert", advertSchema);

const AdvertData = {
  user_id: "5edcf550751fe51af445f8ee",
  name: "string",
  price: 10000,
  city: "string",
  model_name: "string",
  build_id: "string",
  brand_name: "string",
  year_class: 2020,
  os_name: "string",
  photos: [{ photo: "string" }],
};

describe("Advert модель", () => {
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
    const validAdvert = new AdvertModel(AdvertData);
    const savedAdvert = await validAdvert.save();
    // await AdvertModel.deleteOne({ email: AdvertData.email });
  });

  it("Успешное создание и сохранение объявления", async () => {
    const validAdvert = new AdvertModel(AdvertData);
    const savedAdvert = await validAdvert.save();

    expect(savedAdvert._id).toBeDefined();
    expect(savedAdvert.name).toBe(AdvertData.name);
    expect(savedAdvert.price).toBe(AdvertData.price);
    expect(savedAdvert.city).toBe(AdvertData.city);
    expect(savedAdvert.model_name).toBe(AdvertData.model_name);
    expect(savedAdvert.build_id).toBe(AdvertData.build_id);
    expect(savedAdvert.brand_name).toBe(AdvertData.brand_name);
    expect(savedAdvert.year_class).toBe(AdvertData.year_class);
    expect(savedAdvert.os_name).toBe(AdvertData.os_name);
  });

  it("Объяаление успешно сохраняется, неуказанные данные имеют значение undefined", async () => {
    const userWithInvalidField = new AdvertModel(AdvertData);
    const savedUserWithInvalidField = await userWithInvalidField.save();

    expect(savedUserWithInvalidField._id).toBeDefined();
    expect(savedUserWithInvalidField.description).not.toBeDefined();
  });

  it("Создание объявления с идентификатором, который уже был использован должено завершаться ошибкой", async () => {
    await AdvertModel.create(AdvertData);
    const userWithoutRequiredField = new AdvertModel(AdvertData);
    let error;

    try {
      const savedUserWithoutRequiredField = await userWithoutRequiredField.save();
      error = savedUserWithoutRequiredField;
    } catch (err) {
      error = err;
    }

    expect(error.name).toMatch("MongoError");
  });

  it("Создание объявления без обязательных полей должен завершаться ошибкой", async () => {
    const userWithoutRequiredField = new AdvertModel({ model_name: "Name" });
    let err;

    try {
      const savedUserWithoutRequiredField = await userWithoutRequiredField.save();
      error = savedUserWithoutRequiredField;
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });
});
