const { status } = require("http-status");

const prisma =  require('../../middleware/db');
const msg = require("../../environment/message");
const dbLog = require("../../utils/db-logger");

async function listItems(req, res) {
    const actionType = dbLog.actionTypes.ITEM.LIST;

    try {
        const items = await prisma.item.findMany({
            orderBy: { createdAt: 'desc' }            
        });

        await dbLog.write(req.userId, 'Info', actionType, msg.SUCCESS.ITEM_LIST_FOUND);
        return res.status(status.OK).json({ message: msg.SUCCESS.ITEM_LIST_FOUND, items, status: 'success' });
    } catch (err) {
        console.error(err);

        await dbLog.write(req.userId, 'Error', actionType, msg.FAILURE.INTERNAL_SERVER_ERROR);
        return res.status(status.INTERNAL_SERVER_ERROR).json({ message: msg.FAILURE.INTERNAL_SERVER_ERROR, status: 'error' });
    }
}

async function getItem(req, res) {
    const actionType = dbLog.actionTypes.ITEM.GET;

    try {
        const item = await prisma.item.findUnique({
            where: { id: req.params.id }
        });

        if (!item) {
            await dbLog.write(req.userId, 'Error', actionType, msg.FAILURE.ITEM_NOT_FOUND);
            return res.status(status.OK).json({ message: msg.FAILURE.ITEM_NOT_FOUND, status: 'error' });
        }

        await dbLog.write(req.userId, 'Info', actionType, msg.SUCCESS.ITEM_FOUND);
        return res.status(status.OK).json({ message: msg.SUCCESS.ITEM_FOUND, item, status: 'success' });
    } catch (err) {
        await dbLog.write(req.userId, 'Error', actionType, msg.FAILURE.INTERNAL_SERVER_ERROR);
        return res.status(status.INTERNAL_SERVER_ERROR).json({ message: msg.FAILURE.INTERNAL_SERVER_ERROR, status: 'error' });
    }
}

async function createItem(req, res) {
    const actionType = dbLog.actionTypes.ITEM.CREATE;
    console.log(req.user);

    try {
        const item = await prisma.item.create({
            data: {
                name: req.body.name,
                description: req.body.description
            }
        });

        await dbLog.write(req.userId, 'Info', actionType, msg.SUCCESS.ITEM_CREATED);
        return res.status(status.CREATED).json({ message: msg.SUCCESS.ITEM_CREATED, item, status: 'success' });
    } catch (err) {
        console.error(err);

        await dbLog.write(req.userId, 'Error', actionType, msg.FAILURE.INTERNAL_SERVER_ERROR);
        return res.status(status.INTERNAL_SERVER_ERROR).json({ message: msg.FAILURE.INTERNAL_SERVER_ERROR, status: 'error' });
    }
}

async function updateItem(req, res) {
    const actionType = dbLog.actionTypes.ITEM.UPDATE;

    try {
        const item = await prisma.item.update({
            where: { id: req.params.id },
            data: {
                name: req.body.name,
                description: req.body.description
            }
        });

        console.log(item);

        await dbLog.write(req.userId, 'Info', actionType, msg.SUCCESS.ITEM_UPDATED);
        return res.status(status.OK).json({ message: msg.SUCCESS.ITEM_UPDATED, item, status: 'success' });
    } catch (err) {
        console.error(err);

        await dbLog.write(req.userId, 'Error', actionType, msg.FAILURE.INTERNAL_SERVER_ERROR);
        return res.status(status.INTERNAL_SERVER_ERROR).json({ message: msg.FAILURE.INTERNAL_SERVER_ERROR, status: 'error' });
    }
}

async function deleteItem(req, res) {
    const actionType = dbLog.actionTypes.ITEM.DELETE;

    try {
        await prisma.item.delete({
            where: { id: req.params.id }
        });

        await dbLog.write(req.userId, 'Info', actionType, msg.SUCCESS.ITEM_DELETED);
        return res.status(status.OK).json({ message: msg.SUCCESS.ITEM_DELETED, status: 'success' });
    } catch (err) {
        console.error(err);

        await dbLog.write(req.userId, 'Error', actionType, msg.FAILURE.INTERNAL_SERVER_ERROR);
        return res.status(status.INTERNAL_SERVER_ERROR).json({ message: msg.FAILURE.INTERNAL_SERVER_ERROR, status: 'error' });
    }
}

module.exports = {
    listItems,
    getItem,
    createItem,
    updateItem,
    deleteItem
}