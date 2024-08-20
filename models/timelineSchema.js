import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema({
  time: {
    type: String,
    required: [true, "Time is required!"],
  },
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  content: {
    type: String,
    required: [true, "content is required!"],
  },
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
});

export const TimeLine = mongoose.model("TimeLine", timelineSchema);
