const Event = require("../models/event.js");
const Attendee = require("../models/attendee.js");

const createEvent = async (req, res) => {
  const eventData = req.body;

  const event = new Event(eventData);
  await event.save();

  res.json({
    success: true,
    message: "Event created successfully",
  });
};

const getEvents = async (req, res) => {
  const params = req.query;

  const queryObject = {
    name: {
      $regex: new RegExp(params.searchKey),
      $options: "i",
    },
  };

  const events = await Event.find(queryObject);
  res.json({
    success: true,
    results: events,
  });
};

const joinEvent = async (req, res) => {
  const alreadyJoined = Attendee.findOne({
    eventId: req.body.eventId,
    userId: req.user._id,
  });
  if (alreadyJoined) {
    return res.status(400).json({
      success: false,
      message: "User has already joined this event",
    });
  }
  const attendee = new Attendee({
    eventId: req.body.eventId,
    userId: req.user._id,
  });
  await attendee.save();
  res.json({
    success: true,
    message: "Event joined successfully",
  });
};

module.exports = {
  createEvent,
  getEvents,
  joinEvent,
};
