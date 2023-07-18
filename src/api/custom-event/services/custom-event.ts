import {WhereParams} from '@strapi/database';
import {Strapi} from '@strapi/strapi';
import {findEvent, updateEvent} from '../helpers';
import {sendNotificationToTopic} from '../../../utils/firebase';
import {
  startOfWeek,
  endOfWeek,
  addWeeks,
  startOfMonth,
  endOfMonth,
  addMonths,
  differenceInMonths,
} from 'date-fns';

const SLUG = 'api::event.event';

export default () => ({
  getEvents: async ctx => {
    const {query} = ctx.request;
    const {category, name, important} = query;

    let filters: WhereParams<any> = {
      where: {
        end_date: {
          $gte: new Date(),
        },
        publishedAt: {
          $ne: null,
        },
      },
    };

    if (category != null) {
      filters.where.event_categories = [category];
    }

    if (name != null) {
      filters.where.name = {
        $contains: name,
      };
    }

    if (important != null) {
      filters.where.important = important;
    }

    const res = await (strapi as Strapi).db.query(SLUG).findMany({
      where: filters.where,
      populate: ['event_categories', 'image'],
      orderBy: {
        rank: 'asc',
      },
    });

    return res;
  },

  getEventByDate: async ctx => {
    const {query} = ctx.request;
    const {timeframe} = query;
    const now = new Date();

    let startDate, endDate;
    let res = [];

    let filters: WhereParams<any> = {
      where: {
        publishedAt: {
          $ne: null,
        },
      },
    };

    const events = await (strapi as Strapi).db.query(SLUG).findMany({
      where: filters.where,
      populate: ['event_categories', 'image'],
      orderBy: {
        rank: 'asc',
      },
    });

    const currentDate = new Date();
    const targetDate = new Date(currentDate.getFullYear(), 11, 31);
    const monthsRemaining = differenceInMonths(targetDate, currentDate);

    switch (timeframe) {
      case 'THIS_WEEK':
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
        break;
      case 'NEXT_WEEK':
        startDate = startOfWeek(addWeeks(now, 1));
        endDate = endOfWeek(addWeeks(now, 1));
        break;
      case 'NEXT_MONTH':
        startDate = startOfMonth(addMonths(now, 1));
        endDate = endOfMonth(addMonths(now, monthsRemaining));
        break;
      default:
        throw new Error('Invalid timeframe');
    }

    res = events.filter(event => {
      const eventStartDate = new Date(event.start_date);
      const eventEndDate = new Date(event.end_date);

      if (
        (eventStartDate >= startDate && eventStartDate <= endDate) ||
        (eventEndDate >= startDate && eventEndDate <= endDate)
      ) {
        return true;
      }

      if (
        timeframe === 'THIS_WEEK' &&
        eventStartDate <= startDate &&
        eventEndDate >= endDate
      ) {
        return true;
      }

      if (timeframe === 'NEXT_WEEK') {
        const nextWeekStartDate = startOfWeek(addWeeks(now, 1));
        const nextWeekEndDate = endOfWeek(addWeeks(now, 1));
        if (
          eventStartDate <= nextWeekStartDate &&
          eventEndDate >= nextWeekEndDate
        ) {
          return true;
        }
      }

      if (timeframe === 'NEXT_MONTH') {
        const nextMonthStartDate = startOfMonth(addMonths(now, 1));
        const nextMonthEndDate = endOfMonth(addMonths(now, monthsRemaining));
        if (
          eventStartDate <= nextMonthStartDate &&
          eventEndDate >= nextMonthEndDate
        ) {
          return true;
        }
      }

      return false;
    });

    return res;
  },

  getEventById: async ctx => {
    const {query} = ctx.request;
    const {id} = query;

    if (!id) {
      throw new Error('Id is required!');
    }

    const res = await (strapi as Strapi).db.query(SLUG).findOne({
      where: {
        id,
      },
      populate: ['event_categories', 'image'],
    });

    return res;
  },

  updateEvent: async ctx => {
    const {query} = ctx.request;
    const {id, notified} = query;

    if (!id) {
      throw new Error('Id is required');
    }

    const eventToUpdate = await findEvent(id);

    if (!eventToUpdate) {
      throw new Error('Event not found');
    }

    await sendNotificationToTopic({
      title: 'New Upcoming Event',
      description: eventToUpdate.name,
      image: eventToUpdate.image.url,
      id,
      start_date: eventToUpdate.start_date,
      end_date: eventToUpdate.end_date,
    });

    return await updateEvent(id, {notified});
  },
  viewEvent: async ctx => {
    const {params} = ctx.request;
    const {id} = params;
    const event = await findEvent(id);

    if (event) {
      return await updateEvent(id, {...event, ...{views: ++event.views}});
    }
    return null;
  },
});
