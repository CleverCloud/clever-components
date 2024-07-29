import { expect } from '@bundled-es-modules/chai';
import { parseRedisCommand } from '../src/components/cc-redis-explorer/redis-cli.js';

describe('parseRedisCommand', () => {
  it('should return command and empty args', () => {
    const { command, args } = parseRedisCommand('CMD');

    expect(command).to.eql('CMD');
    expect(args).to.deep.eql([]);
  });

  it('should return command and args', () => {
    const { command, args } = parseRedisCommand('CMD arg1 arg2');

    expect(command).to.eql('CMD');
    expect(args).to.deep.eql(['arg1', 'arg2']);
  });

  it('should return command and args unquoted', () => {
    const { command, args } = parseRedisCommand('CMD "argA argB" arg2');

    expect(command).to.eql('CMD');
    expect(args).to.deep.eql(['argA argB', 'arg2']);
  });

  it('should return command and args unquoted', () => {
    const { command, args } = parseRedisCommand('CMD arg1 "argA argB"');

    expect(command).to.eql('CMD');
    expect(args).to.deep.eql(['arg1', 'argA argB']);
  });

  it('should return command and args unquoted but keep escaped quotes', () => {
    const { command, args } = parseRedisCommand('CMD "ar\\"g"');

    expect(command).to.eql('CMD');
    expect(args).to.deep.eql(['ar"g']);
  });

  it('should return command and args unquoted but keep backslash', () => {
    const { command, args } = parseRedisCommand('CMD "ar\\g"');

    expect(command).to.eql('CMD');
    expect(args).to.deep.eql(['ar\\g']);
  });

  it('should return command and args unquoted keep last backslash', () => {
    const { command, args } = parseRedisCommand('CMD "arg\\\\"');

    expect(command).to.eql('CMD');
    expect(args).to.deep.eql(['arg\\']);
  });

  it('should return command and args unquoted keep backslash and escaped quote', () => {
    const { command, args } = parseRedisCommand('CMD "arg\\\\\\""');

    expect(command).to.eql('CMD');
    expect(args).to.deep.eql(['arg\\"']);
  });
});
