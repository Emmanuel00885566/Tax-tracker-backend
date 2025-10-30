import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (email === 'test@example.com' && password === 'password123') {
    const token = jwt.sign({ id: 1, email }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h',
    });
    return res.json({ token });
  }

  res.status(401).json({ message: 'Invalid credentials' });
};