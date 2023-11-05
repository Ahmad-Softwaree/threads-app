"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThread({
  text,
  author,
  communityId,
  path,
}: Params) {
  try {
    connectToDB();
    const createdThread = await Thread.create({
      text,
      author,
      community: null,
    });
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    //This make sure that the changes happen in your next.js app
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchThreads(pageNumber = 1, pageSize = 20) {
  try {
    connectToDB();
    const skip = (pageNumber - 1) * pageSize;
    const threadsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: "desc" })
      .skip(skip)
      .limit(pageSize)
      .populate({ path: "author", model: User })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image",
        },
      });

    const totalPostCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const threads = await threadsQuery.exec();

    const isNext = totalPostCount > skip + threads.length;

    return { isNext, threads };
  } catch (error: any) {
    throw new Error(`Failed to fetch threads: ${error.message}`);
  }
}

export async function fetchSingleThread(id: string) {
  try {
    connectToDB();
    const thread = await Thread.findById(id)
      .populate({ path: "author", model: User, select: "_id id name image" })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id name parentId image",
            },
          },
        ],
      });

    return thread;
  } catch (error: any) {
    throw new Error(`Failed to fetch thread: ${error.message}`);
  }
}

export async function addComment(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  try {
    connectToDB();
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error(`Thread not found`);
    }

    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    const saveCommentThread = await commentThread.save();

    originalThread.children.push(saveCommentThread._id);
    await originalThread.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to add comment: ${error.message}`);
  }
}
