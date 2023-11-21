const express = require("express");
const userSchema = require("../models/userSchema");
const userRoute = express.Router();
const bcrypt = require('bcrypt');

userRoute.get("/retrieve", async (req, res) => 
{
    try 
    {
        const { email } = req.query;
        const user = await userSchema.findOne({ email: email });
  
        if (user) 
        {
            res.json({ balance: user.balance, budget: user.budget, expenditures: user.expenditures || [], transactions: user.transactions || [] });
        } 
        else 
        {
            res.status(404).json({ error: 'User not found' });
        }
    } 
    catch (error) 
    {
        res.status(500).json({ error: error.message });
    }
});

userRoute.post("/login-user", async (req, res) => 
{
    try 
    {
        const { email, password } = req.body;
        const user = await userSchema.findOne({ email: email });

        if (user) 
        {
            // Use bcrypt.compare to compare hashed password
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) 
            {
                if (user.firstLogin) 
                {
                    await userSchema.updateOne({ email: email }, { $set: { firstLogin: false } });
                    res.json({ data: "Success", firstLogin: true });
                }
                else if (!user.firstLogin) 
                {
                    await userSchema.updateOne({ email: email }, { $set: { firstLogin: false } });
                    res.json({ data: "Success", firstLogin: false });
                }
            } 
            else
            {
                res.json("Incorrect");
            }
        } 
        else 
        {
            res.json("No Such User");
        }
    } 
    catch (err) 
    {
        res.status(500).json({ error: err.message });
    }
});

userRoute.post("/create-user", async (req, res) => 
{
    const { email, password } = req.body;
    const saltRounds = 10;
    
    try 
    {
        // Generate salt and hash password
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const newUser = new userSchema({ email, password: hashedPassword });
        const savedUser = await newUser.save();
        res.json(savedUser);
    } 
    catch (err) 
    {
        res.status(500).json({ error: err.message });
    }
});

userRoute.post("/initialize", async (req, res) => 
{
    try 
    {
        const { email, budget, balance } = req.body;
        const updatedUser = await userSchema.findOneAndUpdate(
            { email: email },
            { $set: { budget: budget, balance: balance } },
            { new: true }
        );

        res.json(updatedUser);
    } 
    catch (err) 
    {
        res.status(500).json({ error: err.message });
    }
});

userRoute.post("/update", async (req, res) => 
{
    try 
    {
        const { email, budget, balance, expenditures, transactions } = req.body;
        const updatedUser = await userSchema.findOneAndUpdate(
            { email: email },
            { $set: { budget: budget, balance: balance, expenditures: expenditures, transactions: transactions, } },
        );

        res.json(updatedUser);
    } 
    catch (err) 
    {
        res.status(500).json({ error: err.message });
    }
});

userRoute.post("/update-date", async (req, res) => 
{
    try 
    {
        const { email, date } = req.body;
        const updatedUser = await userSchema.findOneAndUpdate(
            { email: email },
            { $set: { date: date } },
            { new: true }
        );

        res.json(updatedUser);
    } 
    catch (err) 
    {
        res.status(500).json({ error: err.message });
    }
});

userRoute.get("/retrieve-transactions", async (req, res) => 
{
    try 
    {
        const { email } = req.query;
        const user = await userSchema.findOne({ email: email });

        if (user) 
        {
            res.json({ transactions: user.transactions || [] });
        } 
        else 
        {
            res.status(404).json({ error: 'User not found' });
        }
    } 
    catch (error) 
    {
        res.status(500).json({ error: error.message });
    }
});

module.exports = userRoute;
