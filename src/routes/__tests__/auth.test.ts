import User from "../../db/models/user.model";
import { Providers, Roles } from "../../types";

it("auth test 1", async () => {
    console.log("AUTH TEST 1");

    await User.create({
        email: "xaxa@xaxa.com",
        createdWith: Providers.FACEBOOK,
        role: Roles.USER,
        providerId: "123",
    })

    const users = await User.findAll();

    console.log(users.length);
});


it("auth test 2", async () => {
    console.log("AUTH TEST 2");

    // await User.create({
    //     email: "xaxa@xaxa.com",
    //     createdWith: Providers.FACEBOOK,
    //     role: Roles.USER,
    //     providerId: "123",
    // })

    const users = await User.findAll();

    console.log(users.length);
});