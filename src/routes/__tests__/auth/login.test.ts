import User from "../../../db/models/user.model";
import { redisWrapper } from "../../../redis-wrapper";
import { Providers, Roles } from "../../../types";

it("login test 1", async () => {
    console.log("LOGIN TEST 1");

    await User.create({
        email: "xaxa@xaxa.com",
        createdWith: Providers.FACEBOOK,
        role: Roles.USER,
        providerId: "123",
    })

    const users = await User.findAll();

    console.log(users.length);

    await redisWrapper.client.set("xaxa", "kleo");

    console.log((await redisWrapper.client.get("xaxa")))
});


it("login test 2", async () => {
    console.log("LOGIN TEST 2");

    // await User.create({
    //     email: "xaxa@xaxa.com",
    //     createdWith: Providers.FACEBOOK,
    //     role: Roles.USER,
    //     providerId: "123",
    // })

    const users = await User.findAll();

    console.log(users.length);

    console.log((await redisWrapper.client.get("xaxa")))
});