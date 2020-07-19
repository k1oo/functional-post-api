import { POOL, findByUserPk } from '../db';
const { QUERY, EQ, SET } = POOL;
import { catchDBError } from '../error';

export const createPost = async (req, res) => {
  const { user_pk } = req.headers;
  const { title, content } = req.body;

  const [user] = await findByUserPk(user_pk).catch(catchDBError(res));

  if (!user) {
    return res.status(412).json({
      success: false,
      message: 'not found user',
    });
  }

  await QUERY`INSERT INTO posts ${SET({ user_pk, title, content })}`.catch(catchDBError(res));

  return res.json({
    success: true,
    message: 'create succeed',
  });
};

export const getPost = async (req, res) => {
  const { post_pk = undefined, type } = req.query;

  if (type != 'post' && type != 'list') {
    return res.status(412).json({
      success: false,
      message: 'wrong request',
    });
  }

  const post =
    type == 'list'
      ? await QUERY`SELECT * FROM posts`.catch(catchDBError(res))
      : await QUERY`SELECT * FROM posts WHERE ${EQ({ pk: post_pk })}`.catch(catchDBError(res));

  if (!post.length || !post) {
    return res.status(404).json({
      success: false,
      message: 'not found post',
    });
  }

  return res.json({
    success: true,
    data: type == 'list' ? post : post[0],
  });
};
