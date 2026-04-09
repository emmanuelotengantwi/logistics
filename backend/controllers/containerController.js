const Container = require('../models/Container');

const createContainer = async (req, res) => {
    try {
        const { containerNumber, type, departureDate, arrivalDate } = req.body;
        const container = await Container.create({
            containerNumber, type, departureDate, arrivalDate
        });
        res.status(201).json(container);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getContainers = async (req, res) => {
    try {
        const containers = await Container.find({});
        res.json(containers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createContainer, getContainers };
