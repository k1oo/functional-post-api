export const catchDBError = (res) => (err) => {
  console.log(err);
  throw res.status(500).json({
    success: false,
    message: 'database error',
  });
};
