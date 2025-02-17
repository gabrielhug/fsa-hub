import React from 'react';
import {
  View,
  ScrollView,
  Platform
} from 'react-native';
import {
  RkButton,
  RkText,
  RkCard,
} from 'react-native-ui-kitten';
import { Calendar, Permissions } from "expo"
import { UtilStyles } from '../style/styles';
import moment from "moment";
import { Linking } from 'react-native';
import { Ionicons } from "@expo/vector-icons"


export default class Event extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      start: "",
      end: ""
    }

  }
  static navigationOptions = {
    header: null,
  };

  async componentDidMount() {
    await this.setState({
      start: new Date(this.props.start),
      end: new Date(this.props.end)
    })
  }

  async openCall() {
    await Linking.openURL(`https://appr.tc`);
  }

  async onAdd(start, end) {
    // console.log('Calendar object: ', Calendar)
    // console.log('Permissions Object', Permissions)
    await Permissions.askAsync(Permissions.CALENDAR)
    const calArray = await Calendar.getCalendarsAsync()

    // I want to loop through all the objects until I find a calendar with the title of 'Calendar'
    // Then I take that objects id

    if (Platform.OS !== 'android') {

      // this works for iOS, at the least
      const mainCalendar = calArray.find(x => x.title === 'Calendar');
      await console.log('Calendar info: ', mainCalendar)
  
       const iosEvent = await Calendar.createEventAsync(mainCalendar.id, {
        title: this.props.name,
        startDate: new Date(start),
        endDate: new Date(end),
        timeZone: 'PST'
      })
      console.log('iOS event: ', iosEvent)
    } else {
      // Android calendar add
      const event = await Calendar.createEventAsync(calArray[1].id, {
        "endDate": new Date(end),
        "startDate": new Date(start),
        "timeZone": 'PST',
        "title": this.props.name,
      })
      console.log('Android event created: ', event)
    }
  }





  render() {
    const date = moment(this.props.start).format('MMMM Do YYYY, h:mm a').split(",")[0]
    const start = moment(this.props.start).format('MMMM Do YYYY, h:mm a').split(",")[1]
    const end = moment(this.props.end).format('MMMM Do YYYY, h:mm a').split(",")[1]

    return (
      <View style={{ flex: 1, paddingBottom: 15 }}>
        <ScrollView
          // automaticallyAdjustContentInsets={true}
          // style={[UtilStyles.container, styles.screen]}
          >
          <RkCard>
            <View rkCardHeader={true}>
              <View>
                <RkText rkType='header'>{this.props.name}</RkText>
                <RkText rkType='subtitle'>{date} | {start} - {end}</RkText>
              </View>
            </View>
            <View rkCardContent={true} style={{ paddingTop: 0 }}>
              <RkText rkType='compactCardText'>
                {this.props.description}
              </RkText>
              <RkText rkType='compactCardText'>
                Room Name: {this.props.link}
              </RkText>
            </View>
            <View rkCardFooter={true}>
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <RkButton rkType='outline' onPress={() => this.onAdd(this.props.start, this.props.end)}><Ionicons name="md-calendar" size={20} /> Add Event</RkButton>
                <RkButton rkType='outline' onPress={this.openCall}><Ionicons name="md-call" size={20} /> Join Call</RkButton>
              </View>
            </View>
          </RkCard>
        </ScrollView>
      </View>
    );
  }
}