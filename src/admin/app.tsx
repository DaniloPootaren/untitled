import ExportCSV from './extensions/components/ExportCSV';
import ChecklistReport from './extensions/components/ChecklistReport';
import {Interceptor} from './extensions/components/Interceptor';
import {EventComp} from './extensions/components/Event';
import {addStylesToHead} from './extensions/utils/leaflet';

export default {
  config: {
    locales: [],
  },
  bootstrap(app) {
    addStylesToHead();

    app.injectContentManagerComponent('listView', 'actions', {
      name: 'TrainingReport',
      Component: ExportCSV,
    });
    app.injectContentManagerComponent('listView', 'actions', {
      name: 'ChecklistReport',
      Component: ChecklistReport,
    });
    app.injectContentManagerComponent('editView', 'informations', {
      name: 'Interceptor',
      Component: Interceptor,
    });
    app.injectContentManagerComponent('editView', 'right-links', {
      name: 'Notifications',
      Component: EventComp,
    });
  },
};
