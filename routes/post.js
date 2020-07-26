import { POOL, findByUserPk, findByPostPk } from '../db';
const { QUERY, EQ, SET, ASSOCIATE, SQL } = POOL;
import { catchDBError } from '../error';

export const create_post = async (req, res) => {
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

export const get_post = async (req, res) => {
  const { post_pk, type } = req.query;

  if (type != 'post' && type != 'list') {
    return res.status(412).json({
      success: false,
      message: 'wrong request',
    });
  }

  const post =
    type == 'list'
      ? await ASSOCIATE`
        posts
          - user ${{
            left_key: 'user_pk',
            key: 'pk',
            table: 'users',
          }}
      `.catch(catchDBError(res))
      : await ASSOCIATE`
          posts ${SQL`WHERE ${EQ({ pk: post_pk })}`}
            - user ${{
              left_key: 'user_pk',
              key: 'pk',
              table: 'users',
            }}
      `.catch(catchDBError(res));

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

export const patch_post = async (req, res) => {
  const { post_pk, title, content } = req.body;
  const { user_pk } = req.headers;

  if (!(title.length && content.length)) {
    return res.status(412).json({
      success: false,
      message: 'wrong data',
    });
  }

  const [user] = await findByUserPk(user_pk).catch(catchDBError(res));

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'not found user',
    });
  }

  const [post] = await findByPostPk(post_pk).catch(catchDBError(res));

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'not found post',
    });
  }

  Object.assign(post, { title, content });

  await QUERY`
    UPDATE posts
      ${SET(post)}
      WHERE ${EQ({ pk: post.pk })}
  `.catch(catchDBError(res));

  return res.json({
    success: true,
    message: 'patch succeed',
  });
};

export const delete_post = async (req, res) => {
  const { post_pk } = req.query;
  const { user_pk } = req.headers;

  const [user] = await findByUserPk(user_pk).catch(catchDBError(res));

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'not found user',
    });
  }

  const [post] = await findByPostPk(post_pk).catch(catchDBError(res));

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'not found post',
    });
  }

  if (user.pk !== post.user_pk) {
    return res.status(403).json({
      success: false,
      message: 'forbidden',
    });
  }

  await QUERY`
    DELETE FROM posts
      WHERE ${EQ(post)}
  `.catch(catchDBError(res));

  return res.json({
    success: true,
    message: 'delete succeed',
  });
};
