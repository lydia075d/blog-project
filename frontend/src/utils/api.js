export const fetchBlogs = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/blogs`);
  return response.json();
};

export const createBlog = async (blogData) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/blogs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blogData),
  });
  return response.json();
};
