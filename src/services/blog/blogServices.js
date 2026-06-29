const serverUrl = "https://madhuban-backend-s1l7.onrender.com";

export const getAllBlogs = async (pageCount, limit) => {
  let url = "";
  if (!pageCount && !limit) {
    url = `${serverUrl}/api/blogs/all/madhuban?type=blog&status=Published`;
  } else {
    url = `${serverUrl}/api/blogs/all/madhuban?type=blog&status=Published&page=${pageCount}&limit=${limit}`;
  }
  try {
    // Revalidate so newly published blogs appear. "force-cache" froze the
    // list in the Data Cache indefinitely, hiding any blog published after
    // the first render.
    const res = await fetch(url, {
      next: { revalidate: 300 },
    }).then((response) => response.json());

    return res;
  } catch (err) {
    console.error("Error fetching blogs:", err);
    return null;
  }
};

export const getBlogById = async (id) => {
  try {
    const res = await fetch(`${serverUrl}/api/blogs/${id}/madhuban`, {
      cache: "force-cache",
    }).then((response) => response.json());
    return res;
  } catch (err) {
    console.error("Error fetching blog by ID:", err);
    return null;
  }
};
