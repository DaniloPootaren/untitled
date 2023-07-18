import {editViewValidator} from '../../../../admin/extensions/utils/validation';
import {
  Checklist,
  ChecklistResult,
  ChecklistStatus,
} from '../../../../models/api-model';
import {
  generateChecklistReport,
  getChecklistById,
  getChecklistReportName,
  getChecklistResults,
  getReportFilters,
  transformChecklistResults,
} from '../../../custom-checklist/helpers';
import {mailInstance} from '../../../../utils/email';
import {FileFormat} from '../../../../admin/extensions/model';

export default {
  async beforeUpdate(event) {
    const {params, model} = event;

    const validator = editViewValidator[model.uid];
    const error = validator?.(params.data);

    if (error) {
      throw new Error(error.error);
    }
  },

  async afterUpdate(event) {
    const {result}: {result: ChecklistResult} = event;

    if (result.status === ChecklistStatus.submitted) {
      const {profile} = result.users_permissions_user;
      const fullName = profile.name + ' ' + profile.surname;
      const checklist = result.checklist.id;
      const checklistType = result.section[0].__component;

      const filters = getReportFilters({
        id: result.id,
      });

      const checklists: Checklist[] = await getChecklistById(checklist);

      const checklistResults: ChecklistResult[] = await getChecklistResults(
        filters,
      );

      const {buffer} = generateChecklistReport(
        checklists[0],
        transformChecklistResults(checklistResults),
        FileFormat.XLSX,
        checklistType,
      );

      const filename = getChecklistReportName(
        result.checklist.name,
        result.checklist.name,
        null,
      );

      // no await needed
      mailInstance.sendAttachmentToIPCOfficer({
        email: result.users_permissions_user.email,
        fullName,
        attachment: {
          filename,
          content: buffer,
        },
        checklistName: result.checklist.name,
        submittedDate: result.updatedAt,
        hospitalName: result.hospital.name,
        visitingTeam: result.visiting_team,
        ward: result.ward,
        department: result.department,
      });
    }
  },
};
