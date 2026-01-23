import Setting, { SettingAttributes } from '../../models/Setting';
import Seeder from '../../core/seeder';
import settings from '../backup/settings.json';

const typedSettings: SettingAttributes[] = settings;

export default class SettingsSeeder {
    public async up(): Promise<void> {
        await Seeder.insertData(Setting, typedSettings);
    }

    public async down(): Promise<void> {
        await Seeder.deleteData(Setting);
    }
}
