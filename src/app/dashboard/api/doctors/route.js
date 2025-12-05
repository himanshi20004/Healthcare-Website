const all = await User.find();
//console.log("ALL USERS:", all);

const doctors = await User.find({ role: "doctor" });
console.log("DOCTORS:", doctors);

return Response.json({ all, doctors });
