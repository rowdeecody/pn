import Seeder from '../../core/seeder';
import UserSeeder from './user.seeder';
import SettingsSeeder from './settings.seeder';

(async () => {
    const action: string = process.argv[2];

    if (action === 'up' || action === 'down') {
        // Add your seeder calls here, e.g.:
        await Seeder.call(UserSeeder, action);
        await Seeder.call(SettingsSeeder, action);

        await Seeder.run();
    }
})();
