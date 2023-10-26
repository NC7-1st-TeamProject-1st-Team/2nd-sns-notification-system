import User from '../../schemas/user';

export const test = async (req, res, next) => {
  console.log('get 요청 수신 성공@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
  try {
    return res.json({ test: '통신 성공!' });
  } catch (err) {
    console.error(err);
    res.status(403).send(err);
    return next(err);
  }
};

export const addUser = async (req, res, next) => {
  try {
    const user = await User.create({
      mno: req.body.no,
      name: req.body.name,
      nick: req.body.nick,
      photo: req.body.photo,
      rooms: [],
    });
    return res.json(user);
  } catch (err) {
    console.error(err);
    res.status(403).send(err);
    return next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.updateOne({ mno: req.body.no }, [
      {
        $set: {
          mno: req.body.no,
          name: req.body.name,
          nick: req.body.nick,
          photo: {
            $cond: [{ $not: [!req.body.photo] }, req.body.photo, '$photo'],
          },
        },
      },
    ]);
    return res.json(user);
  } catch (err) {
    console.error(err);
    res.status(403).send(err);
    return next(err);
  }
};
