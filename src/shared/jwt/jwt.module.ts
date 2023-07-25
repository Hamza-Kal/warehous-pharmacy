import { JwtModule } from '@nestjs/jwt';

export default JwtModule.register({
  secret: `faek`,
  signOptions: { expiresIn: '180h' },
});
