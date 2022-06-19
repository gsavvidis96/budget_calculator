import User from "../../../db/models/user.model";
import { Providers, Roles } from "../../../types";

it("signup test 1", async () => {
    console.log("SIGNUP TEST 1");

    await User.create({
        email: "xaxa@xaxa.com",
        createdWith: Providers.FACEBOOK,
        role: Roles.USER,
        providerId: "123",
    })

    const users = await User.findAll();

    console.log(users.length);
});


it("signup test 2", async () => {
    console.log("SIGNUP TEST 2");

    // await User.create({
    //     email: "xaxa@xaxa.com",
    //     createdWith: Providers.FACEBOOK,
    //     role: Roles.USER,
    //     providerId: "123",
    // })

    const users = await User.findAll();

    console.log(users.length);
});