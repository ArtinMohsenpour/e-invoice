import * as migration_20260119_224402_users_table_update from './20260119_224402_users_table_update';

export const migrations = [
  {
    up: migration_20260119_224402_users_table_update.up,
    down: migration_20260119_224402_users_table_update.down,
    name: '20260119_224402_users_table_update'
  },
];
